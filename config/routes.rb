require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do
  #root "pages#home"


  mount Sidekiq::Web => '/sidekiq'
  #root "components#index"

  get '/show', to: 'show#index'
  post '/api/v1/gps', to: 'gps#create'
  get '/api/v1/index', to: 'gps#index'  
  get '/api/v1/list', to: 'gps#list'     
  post '/api/v1/vehicle', to: 'vehicle#create'    
  
end
