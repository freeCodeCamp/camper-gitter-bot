# GitterBot for FCC

Join us in Gitter to discuss!
https://gitter.im/dcsan/gitterbot

## checking out
we use git submodules for some wiki data, so use:

    git clone
    git submodule init
    git submodule update


## environment

we're using the latest es6 so best to get an up to date environment.
at the time of writing iojs was a bit ahead of node so:

```bash
# ubuntu
sudo apt-get upgrade
sudo apt-get install build-essential
```
on the mac you may not need to do that, but update npm to be sure.

We use n to manage iojs installation:
```
sudo npm install -g n
sudo n io latest
```

To run the app you need to auth it with your gitter credentials
see the `bin/credentials-example.sh` file

create a copy of that and then from the root of the app run:

    $ bin/run.sh

there are other commands in `bin` for running tests with the right config files etc

to run the tests with the right configs

    $ bin/test.sh

# content
The wiki content is pulled in from FCC's wiki using a git submodule
But then we just copy it and commit it back to the main app as submodules are nasty to deal with on production servers.

    bin/wiki-update.sh



# System Overview

Sorry that these docs are very lightweight right now.
To understand the system some basic places to look.

