TESTS = $(shell find . -name "*.test.js")

test:
	@mocha -u tdd --globals "encoding" -t 8000 $(TESTS) -R spec


.PHONY: test
