# GitterBot for FCC

## environment

we're using the latest es6 so best to get an up to date environment.
at the time of writing iojs was a bit ahead of node so:

```bash
# ubuntu
sudo apt-get upgrade
sudo apt-get install build-essential
sudo npm install -g n
sudo n io latest
```

to run the app you need to auth it with your gitter credentials
see the `bin/credentials-example.sh` file

create a copy of that
and then from the root of the app 

    $ bin/run.sh

there are other commands in `bin` for running tests with the right config files etc

based on this spec
https://docs.google.com/document/d/1ThkBj7CuLoNY0M4g6dTgdD1ENysbQEXbnlLXIKm3lOM/edit
