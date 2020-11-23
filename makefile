include .env
export

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
