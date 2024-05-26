const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Season = require('../models/Season');
const bcrypt = require('bcrypt');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose');
const { response, request } = require('express');

class searchController{
    show(req, res) {
        Promise.all([
            Anime.find({}),
        ])
        .then(([animes]) => {
            function processString(str) {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/ô/g, "o")
                    .replace(/đ/g, "d");
            }
            const animele = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-le")
            );
            const animebo = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-bo")
            );

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());


            const searchText = req.body.search; 

            Anime.find({ "title": new RegExp(searchText, "i") })
                .then(actionMovie => {
                    const actionMovies = mutipleMongooseToObject(actionMovie);

                    res.render('season/show', { 
                        actionMovies: actionMovies,
                        top_bo: animeboData.slice(0, 5),
                        top_le: animeleData.slice(0, 5),
                    });
                    // res.json(actionMovies);
                })
                .catch(err => {
                    // Xử lý lỗi nếu có
                    res.status(500).send(err);
                });
            // res.json(req.body);
        })
        .catch(err => {
                    // Xử lý lỗi nếu có
                    res.status(500).send(err);
                });
    }
    loc(req, res) {
            Promise.all([
                Anime.find({}),
            ])
            .then(([animes]) => {
                function processString(str) {
                    return str
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/ô/g, "o")
                        .replace(/đ/g, "d");
                }
                const animele = animes.filter(movie =>
                    movie.InfoList &&
                    Array.isArray(movie.InfoList.Genre) &&
                    movie.InfoList.Genre.some(genre => processString(genre) === "anime-le")
                );
                const animebo = animes.filter(movie =>
                    movie.InfoList &&
                    Array.isArray(movie.InfoList.Genre) &&
                    movie.InfoList.Genre.some(genre => processString(genre) === "anime-bo")
                );

                // Chuyển đổi dữ liệu từ Mongoose object sang plain object
                const animeData = mutipleMongooseToObject(animes);
                const animeboData = mutipleMongooseToObject(animebo);
                const animeleData = mutipleMongooseToObject(animele.reverse());
                if(req.query.page !== null && req.query.page !== undefined){
                    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
                    const itemsPerPage = 30;

                    const paginate = (data) => {
                        const totalPages = Math.ceil(data.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        return {
                            paginatedData: data.slice(startIndex, startIndex + itemsPerPage),
                            totalPages,
                        };
                    };
                    const { paginatedData, totalPages } = paginate(req.session.query);
                            res.render('season/show', { 
                                actionMovies: paginatedData,
                                top_bo: animeboData.slice(0, 5),
                                top_le: animeleData.slice(0, 5),
                                currentPage,
                                totalPages,
                            });
                }else {
                    let genres = req.body.Genre;
                    let season = req.body.Season;
                    let year = req.body.year;
                    let seasons = [];
                    if (!Array.isArray(genres)) {
                        genres = [genres];
                    }
                    if (genres.length === 1 && genres[0] == "all") {
                        genres = [];
                    } else if (genres.length > 1) {
                        genres = genres.filter(gen => gen != "all");
                    }
                    if (season != "all") {
                        seasons.push(season);
                    }
                    if (year != "all") {
                        seasons.push(year);
                    }
                    let query = {};
                    if (genres.length > 0) {
                        query["InfoList.Genre"] = { $all: genres };
                    }
                    if (seasons.length > 0) {
                        query["InfoList.Season"] = { $all: seasons };
                    }

                    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
                    const itemsPerPage = 30;

                    const paginate = (data) => {
                        const totalPages = Math.ceil(data.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        return {
                            paginatedData: data.slice(startIndex, startIndex + itemsPerPage),
                            totalPages,
                        };
                    };
                        Anime.find(query)
                        .then(actionMovies => {
                            const actionMoviesData = mutipleMongooseToObject(actionMovies).reverse();
                            req.session.query = actionMoviesData;
                            const { paginatedData, totalPages } = paginate(actionMoviesData);
                            res.render('season/show', { 
                                actionMovies: paginatedData,
                                top_bo: animeboData.slice(0, 5),
                                top_le: animeleData.slice(0, 5),
                                currentPage,
                                totalPages,
                            });
                            // res.json(req.body)
                        })
                        .catch(err => {
                            res.status(500).send(err);
                        });
                } 
            })
            .catch(err => {
                res.status(500).send(err);
            });
        }

}
module.exports = new searchController();