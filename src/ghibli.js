const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
var morgan = require('morgan');
require('dotenv').config()
const port = 3000;
const app = express();
const route = require('./routes/ghibli');
const db = require('./config/db/ghibli');
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
app.use(methodOverride('_method'));

// Templates engine
app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
        helpers:{
            sum: (a,b) => a+b,
            pagination:(currentPage, totalPages) => {
                let html = '<ul class="pagination">';
                // Previous page button
                if (currentPage > 1) {
                    html += '<li class="page-item"><a class="page-link" href="?page=' + (currentPage - 1) + '">Trang '+(currentPage)+'/'+(totalPages)+'</a></li>';
                }
                // Pages
                if(currentPage>1){
                    html += '<li class="page-item"><a class="page-link" href="?page=' + (currentPage - 1) + '">' + (currentPage - 1) + '</a></li>';
                }
                for (let i = currentPage; i <= totalPages; i++) {
                    html += '<li class="page-item';
                    if (i === currentPage) {
                        html += ' active';
                    }
                    if(i<=currentPage+2){
                        html += '"><a class="page-link" href="?page=' + i + '">' + i + '</a></li>';
                    }
                    
                }
                // Next page button
                if (currentPage < totalPages) {
                    html += '<li class="page-item"><a class="page-link" href="?page=' + (totalPages) + '">Trang Cuối</a></li>';
                }
                html += '</ul>';
                // return html;
                return new Handlebars.SafeString(html);
            },

            slugify: (text) =>{
                var slug = text.toLowerCase().replace(/\s+/g, '-');
                slug = slug.replace('anime-bộ', 'anime-bo').replace('anime-lẻ', 'anime-le');
                return slug;
            },
            time: (text) =>{
                var dateString = text
                var dateUTC = new Date(dateString);
                dateUTC.setHours(dateUTC.getHours() + 7);

                // Lấy ngày, tháng, năm
                var day = dateUTC.getDate().toString();
                var month = dateUTC.getMonth() + 1; // Tháng bắt đầu từ 0
                var year = dateUTC.getFullYear();
                return (day < 10 ? '0' : '') + day + '-' + (month < 10 ? '0' : '') + month + '-' + year;
            }
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

route(app);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});