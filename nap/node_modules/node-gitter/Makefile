.PHONY: all npm validate test security-check clean

ci: clean npm validate test

clean:
	rm -rf output/

npm:
	npm prune
	npm install

validate: npm security-check

test:
	npm test

security-check:
	./node_modules/.bin/retire -n
