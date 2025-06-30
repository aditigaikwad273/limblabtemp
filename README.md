
## Initial setup

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Install [Ruby 2.7.3](https://www.ruby-lang.org/en/documentation/installation/)
3. Install [Postgres](https://www.postgresql.org/download/)


## Grabbing the code

The setup right now is that the code lives in multiple remote repos -- one repo per environment. 

Let's start by grabbing production:

```bash
> git clone git@bitbucket.org:accella/limblab.git
> cd limblab
> git checkout master
```

Now be sure you installed and are authenticated to the Heroku CLI, as that is where we keep both the staging and dev environments.

```bash
> cd limblab
> git remote add dev https://git.heroku.com/limb-lab-dev.git
```

## Running locally

```bash
> cd limblab
> rails db:create   # creates the dev and testing databases locally
> rails db:migrate  # creates the database schema (tables, columns, constraints, and indexes)
> rails server      # runs the web server, visit http://localhost:3000 in a browser
```

## Creating initial data

Open `db/seeds.rb` in an editor and edit the bottom of the file to create an various accounts for yourself (use your email and set a hard coded password). After running the following, you should be able to access:

* the admin by going to `http://localhost:3000`

```bash 
> cd limblab       # be sure to edit db/seeds.rb
> rails db:seed    # create initial supporting data
```

## Running with environment variables locally

``` bash
> heroku local -e .env.dev
```

## Releasing to dev

```bash
> git push dev master
> heroku run rails db:migrate -a limb-lab-dev
```

## Releasing to production

``` bash
> git push origin master`
> bundle exec cap production deploy`
```

## Rolling back production

``` bash
> bundle exec cap production rollback
```
