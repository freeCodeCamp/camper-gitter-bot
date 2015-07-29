/* -*- indent-tabs-mode: nil; c-basic-offset: 2; tab-width: 2 -*- */

/* This code is PUBLIC DOMAIN, and is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND. See the accompanying
 * LICENSE file.
 */

#include <nan.h>
#include <curl/curl.h>
#include <string>
#include <string.h>
#include <vector>
#include <stdint.h>
#include <iostream>

using namespace node;
using namespace v8;

#define THROW_BAD_ARGS \
  NanThrowTypeError("Bad argument")

#define PERSISTENT_STRING(id, text) \
  NanAssignPersistent<String>(id, NanNew<String>(text))

typedef std::vector<char> buff_t;

class CurlLib : ObjectWrap {
private:
  static std::string buffer;
  static std::vector<std::string> headers;
  static Persistent<String> sym_body_length;
  static Persistent<String> sym_headers;
  static Persistent<String> sym_timedout;
  static Persistent<String> sym_error;

public:
  static Persistent<Function> s_constructor;
  static void Init(Handle<Object> target) {
    Local<FunctionTemplate> t = NanNew<FunctionTemplate>(New);

    t->InstanceTemplate()->SetInternalFieldCount(1);
    t->SetClassName(NanNew<String>("CurlLib"));

    NODE_SET_PROTOTYPE_METHOD(t, "run", Run);
    NODE_SET_PROTOTYPE_METHOD(t, "body", Body);

    NanAssignPersistent<Function>(s_constructor, t->GetFunction());
    target->Set(NanNew<String>("CurlLib"),
                t->GetFunction());

    PERSISTENT_STRING(sym_body_length, "body_length");
    PERSISTENT_STRING(sym_headers, "headers");
    PERSISTENT_STRING(sym_timedout, "timedout");
    PERSISTENT_STRING(sym_error, "error");
  }

  CurlLib() { }
  ~CurlLib() { }

  static NAN_METHOD(New) {
    NanScope();
    CurlLib* curllib = new CurlLib();
    curllib->Wrap(args.This());
    NanReturnValue(args.This());
  }

  static size_t write_data(void *ptr, size_t size,
			   size_t nmemb, void *userdata) {
    buffer.append(static_cast<char*>(ptr), size * nmemb);
    // std::cerr<<"Wrote: "<<size*nmemb<<" bytes"<<std::endl;
    // std::cerr<<"Buffer size: "<<buffer.size()<<" bytes"<<std::endl;
    return size * nmemb;
  }

  static size_t write_headers(void *ptr, size_t size, size_t nmemb, void *userdata)
  {
    std::string header(static_cast<char*>(ptr), size * nmemb);
    headers.push_back(header);
    return size * nmemb;
  }

  static NAN_METHOD(Body) {
    NanScope();

    if (args.Length() < 1 || !Buffer::HasInstance(args[0])) {
      return THROW_BAD_ARGS;
    }

    Local<Object> buffer_obj = args[0]->ToObject();
    char *buffer_data        = Buffer::Data(buffer_obj);
    size_t buffer_length     = Buffer::Length(buffer_obj);

    if (buffer_length < buffer.size()) {
      return NanThrowTypeError("Insufficient Buffer Length");
    }

    if (!buffer.empty()) {
      memcpy(buffer_data, buffer.data(), buffer.size());
    }
    buffer.clear();
    NanReturnValue(buffer_obj);
  }

  static NAN_METHOD(Run) {
    NanScope();

    if (args.Length() < 1) {
      return THROW_BAD_ARGS;
    }

    Local<String> key_method = NanNew<String>("method");
    Local<String> key_url = NanNew<String>("url");
    Local<String> key_headers = NanNew<String>("headers");
    Local<String> key_body = NanNew<String>("body");
    Local<String> key_connect_timeout_ms = NanNew<String>("connect_timeout_ms");
    Local<String> key_timeout_ms = NanNew<String>("timeout_ms");
    Local<String> key_rejectUnauthorized = NanNew<String>("rejectUnauthorized");
    Local<String> key_caCert = NanNew<String>("ca");
    Local<String> key_clientCert = NanNew<String>("cert");
    Local<String> key_pfx = NanNew<String>("pfx");
    Local<String> key_clientKey = NanNew<String>("key");
    Local<String> key_clientKeyPhrase = NanNew<String>("passphrase");

    static const Local<String> PFXFORMAT = NanNew<String>("P12");

    Local<Array> opt = Local<Array>::Cast(args[0]);

    if (!opt->Has(key_method) ||
        !opt->Has(key_url) ||
        !opt->Has(key_headers)) {
      return THROW_BAD_ARGS;
    }

    if (!opt->Get(key_method)->IsString() ||
        !opt->Get(key_url)->IsString()) {
      return THROW_BAD_ARGS;
    }

    Local<String> method = Local<String>::Cast(opt->Get(key_method));
    Local<String> url    = Local<String>::Cast(opt->Get(key_url));
    Local<Array>  reqh   = Local<Array>::Cast(opt->Get(key_headers));
    Local<String> body   = NanNew<String>((const char*)"", 0);
    Local<String> caCert   = NanNew<String>((const char*)"", 0);
    Local<String> clientCert   = NanNew<String>((const char*)"", 0);
    Local<String> clientCertFormat   = NanNew<String>((const char*)"", 0);
    Local<String> clientKey   = NanNew<String>((const char*)"", 0);
    Local<String> clientKeyPhrase   = NanNew<String>((const char*)"", 0);
    long connect_timeout_ms = 1 * 60 * 60 * 1000; /* 1 hr in msec */
    long timeout_ms = 1 * 60 * 60 * 1000; /* 1 hr in msec */
    bool rejectUnauthorized = false;

    if (opt->Has(key_caCert) && opt->Get(key_caCert)->IsString()) {
      caCert = opt->Get(key_caCert)->ToString();
    }

    if (opt->Has(key_clientKey) && opt->Get(key_clientKey)->IsString()) {
      clientKey = opt->Get(key_clientKey)->ToString();
    }

    if (opt->Has(key_clientKeyPhrase) && opt->Get(key_clientKeyPhrase)->IsString()) {
      clientKeyPhrase = opt->Get(key_clientKeyPhrase)->ToString();
    }

    if (opt->Has(key_clientCert) && opt->Get(key_clientCert)->IsString()) {
      clientCert = opt->Get(key_clientCert)->ToString();
    } else if (opt->Has(key_pfx) && opt->Get(key_pfx)->IsString()) {
      clientCert = opt->Get(key_pfx)->ToString();
      clientCertFormat = PFXFORMAT;
    }

    if (opt->Has(key_body) && opt->Get(key_body)->IsString()) {
      body = opt->Get(key_body)->ToString();
    }

    if (opt->Has(key_connect_timeout_ms) && opt->Get(key_connect_timeout_ms)->IsNumber()) {
      connect_timeout_ms = opt->Get(key_connect_timeout_ms)->IntegerValue();
    }

    if (opt->Has(key_timeout_ms) && opt->Get(key_timeout_ms)->IsNumber()) {
      timeout_ms = opt->Get(key_timeout_ms)->IntegerValue();
    }

    if (opt->Has(key_rejectUnauthorized)) {
      // std::cerr<<"has reject unauth"<<std::endl;
      if (opt->Get(key_rejectUnauthorized)->IsBoolean()) {
        rejectUnauthorized = opt->Get(key_rejectUnauthorized)->BooleanValue();
      } else if (opt->Get(key_rejectUnauthorized)->IsBooleanObject()) {
        rejectUnauthorized = opt->Get(key_rejectUnauthorized)
          ->ToBoolean()
          ->BooleanValue();
      }
    }

    // std::cerr<<"rejectUnauthorized: " << rejectUnauthorized << std::endl;

    NanUtf8String _body(body);
    NanUtf8String _method(method);
    NanUtf8String _url(url);
    NanUtf8String _cacert(caCert);
    NanUtf8String _clientcert(clientCert);
    NanUtf8String _clientcertformat(clientCertFormat);
    NanUtf8String _clientkeyphrase(clientKeyPhrase);
    NanUtf8String _clientkey(clientKey);

    std::vector<std::string> _reqh;
    for (size_t i = 0; i < reqh->Length(); ++i) {
      _reqh.push_back(*NanUtf8String(reqh->Get(i)));
    }

    // CurlLib* curllib = ObjectWrap::Unwrap<CurlLib>(args.This());

    buffer.clear();
    headers.clear();

    CURL *curl;
    CURLcode res = CURLE_FAILED_INIT;

    // char error_buffer[CURL_ERROR_SIZE];
    // error_buffer[0] = '\0';

    curl = curl_easy_init();
    if (curl) {
      // curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
      // curl_easy_setopt(curl, CURLOPT_ERRORBUFFER, error_buffer);

      curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, *_method);
      if (_body.length() > 0) {
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, *_body);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDSIZE,
                         (curl_off_t)_body.length());
      }
      curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1);
      curl_easy_setopt(curl, CURLOPT_MAXREDIRS, 5);
      curl_easy_setopt(curl, CURLOPT_URL, *_url);
      curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_data);
      curl_easy_setopt(curl, CURLOPT_HEADERFUNCTION, write_headers);

      curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT_MS, connect_timeout_ms);
      curl_easy_setopt(curl, CURLOPT_TIMEOUT_MS, timeout_ms);

      if (rejectUnauthorized) {
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 1L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 2L);
      } else {
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYHOST, 0L);
      }

      if (_cacert.length() > 0) {
        curl_easy_setopt(curl, CURLOPT_CAINFO, *_cacert);
      }

      if (_clientcert.length() > 0) {
        if (_clientcertformat.length() > 0) {
          curl_easy_setopt(curl, CURLOPT_SSLCERTTYPE, *_clientcertformat);
        }
        curl_easy_setopt(curl, CURLOPT_SSLCERT, *_clientcert);
      }

      if (_clientkeyphrase.length() > 0) {
        curl_easy_setopt(curl, CURLOPT_KEYPASSWD, *_clientkeyphrase);
      }

      if (_clientkey.length() > 0) {
        curl_easy_setopt(curl, CURLOPT_SSLKEY, *_clientkey);
      }

      struct curl_slist *slist = NULL;

      for (size_t i = 0; i < _reqh.size(); ++i) {
        slist = curl_slist_append(slist, _reqh[i].c_str());
      }

      curl_easy_setopt(curl, CURLOPT_HTTPHEADER, slist);

      res = curl_easy_perform(curl);

      curl_slist_free_all(slist);

      /* always cleanup */
      curl_easy_cleanup(curl);
    }

    // std::cerr<<"error_buffer: "<<error_buffer<<std::endl;

    Local<Object> result = NanNew<Object>();

    if (!res) {
      result->Set(NanNew(sym_body_length), NanNew<Integer>((int32_t)buffer.size()));
      Local<Array> _h = NanNew<Array>();
      for (size_t i = 0; i < headers.size(); ++i) {
        _h->Set(i, NanNew<String>(headers[i].c_str()));
      }
      result->Set(NanNew(sym_headers), _h);
    }
    else if (res == CURLE_OPERATION_TIMEDOUT) {
      result->Set(NanNew(sym_timedout), NanNew<Integer>(1));
    } else {
      result->Set(NanNew(sym_error), NanNew<String>(curl_easy_strerror(res)));
    }

    headers.clear();
    NanReturnValue(result);
  }
};

Persistent<Function> CurlLib::s_constructor;
std::string CurlLib::buffer;
std::vector<std::string> CurlLib::headers;
Persistent<String> CurlLib::sym_body_length;
Persistent<String> CurlLib::sym_headers;
Persistent<String> CurlLib::sym_timedout;
Persistent<String> CurlLib::sym_error;

extern "C" {
  static void init (Handle<Object> target) {
    CurlLib::Init(target);
  }
  NODE_MODULE(curllib, init);
}

