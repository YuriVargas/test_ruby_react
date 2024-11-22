# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js",preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin_all_from "app/javascript/components", under: "components"
pin "object-assign" # @4.1.1
pin "htm" # @3.1.1
pin "@github/hotkey", to: "@github--hotkey.js" # file lives in vendor/javascript/@github--hotkey.js
pin "md5", preload: false # file lives in vendor/javascript/md5.js
pin "checkout", preload: false
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "react-dom" # @17.0.2
pin "json" # @11.0.0
