class GpsJob
  include Sidekiq::Job
  queue_as :default
  def perform(*args)
    puts "I am perfomance"
  end
end
