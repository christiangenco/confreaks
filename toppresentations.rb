require 'json'
require 'pry'

unless File.exists?("videos.json")
  `curl http://confreaks.tv/api/v1/videos.json > videos.json`
end

videos = JSON.parse(File.read('videos.json'))
videos.sort_by!{|v| v["views"]}.reverse!

videos.take(100).each{|video|
  puts video["title"]
}
binding.pry
