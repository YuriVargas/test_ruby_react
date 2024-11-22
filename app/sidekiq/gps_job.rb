class GpsJob
  include Sidekiq::Job

  def perform(*args)
    puts "I am perfomance"
  end
end
