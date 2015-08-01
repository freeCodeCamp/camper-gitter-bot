# GitterBot for FCC

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

