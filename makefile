include .env
export

init: web/env.js get-libs

run:
	firefox web/index.html

web/env.js: .env
	@rm -f $@
	@echo "const env = {" >> $@
	@echo "  API_BASE_URL: '$(API_BASE_URL)'" >> $@
	@echo "}" >> $@
	@cat $@

show_env: .env
	@cat .env

get-libs:
	mkdir -p web/libs
	wget -P web/libs https://unpkg.com/layout-base/layout-base.js
	wget -P web/libs https://unpkg.com/avsdf-base/avsdf-base.js
	wget -P web/libs https://unpkg.com/cose-base/cose-base.js
