FROM ruby:3.2.0

WORKDIR /test_ruby_rails
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client imagemagick libvips yarn

COPY Gemfile /test_ruby_rails/Gemfile
COPY Gemfile.lock /test_ruby_rails/Gemfile.lock

RUN bundle install

ENV BUNDLE_VERSION 1.17.3
RUN gem install bundler --version "$BUNDLE_VERSION"

RUN bundle exec rails \
    yarn install \
    rails css:install:bootstrap \
    rails generate react:install \
    add jsbundling-rails \
    rails javascript:install:esbuild \
    rails turbo:install \
    rails stimulus:install 

RUN yarn add nvm --latest
RUN yarn add react react-dom esbuild react-bootstrap sweetalert2 typescript @hotwired/turbo-rails @types/react @types/react-dom --ignore-engines
RUN gem install foreman

COPY package*.json yarn.lock ./
COPY tsconfig.json ./
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["rails", "server", "-b", "0.0.0.0"]