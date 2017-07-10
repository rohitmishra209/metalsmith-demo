var Metalsmith = require('metalsmith'),
    markdown   = require('metalsmith-markdown');
    templates  = require('metalsmith-templates');
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks');
var request    =  require('request')


Metalsmith(__dirname)
    .use(collections({
        pages: {
            pattern: 'content/pages/*.md'
        },
        articles: {
            pattern: 'content/articles/*.md',
            sortBy: 'date'
        }
    }))

    .use(function (files, metalsmith, done) {
        request({
            url: 'https://api.contentstack.io/v3/content_types/home/entries',
            method: 'GET',
            headers: {
                api_key: "blt9bab903dad20cd9f",
                access_token: "blt71ae48555567eceb"
            },
            json: true
        }, function (error, response, body) {
            //console.log("body",files)
          //responseres.render("/src/pages/about.md", body)
            if(error)
                return error;
           // console.log('@body', JSON.stringify(body));
            var fileNames = Object.keys(files);

            for(var i = 0, j = fileNames.length; i < j; i++) {
                if(fileNames[i] === 'content/pages/about.md') {
                 files[fileNames[i]].entries = body.entries                   
                    
               }
            }
            done();
        })
    })
    .use(markdown())
    .use(permalinks({
        pattern: ':collections/:title'
    }))

    .use(templates({
        engine: 'handlebars',
        partials: {
            header: 'partials/header',
            footer: 'partials/footer'
        }
    }))
    .destination('./build')
    .clean(true)
    .build(function (err) { if(err) console.log(err) })