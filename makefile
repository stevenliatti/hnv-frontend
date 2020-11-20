include .env
export

run:
	firefox web/index.html

web/env.js: .env
	@rm -f $@
	@echo "const env = {" >> $@
	@echo "  API_URL: '$(API_URL)'" >> $@
	@echo "}" >> $@
	@cat $@

show_env: .env
	@cat .env
