/**
 * SendanywayController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    signup: async function (req, res) {
        var username = req.body.emailSignup;
        var password = req.body.passSignup;

        await Sendanyway.findOne({ user: username }).exec(function (err, sendanyway) {
            console.log(sendanyway.user);
            console.log(username);
            if (sendanyway.user == username) {
                console.log("if tren");
                res.send("Tai khoan da ton tai");
            }
        });
        Sendanyway.create({ user: username, password: password }).exec(function (err) {
            if (err) {
                res.send(500, { error: 'Database error' });
            }
            res.redirect('/Sendanyway/login');
        });
    },

    login: function (req, res) {
        var username = req.body.emailLogin;
        var password = req.body.passLogin;

        Sendanyway.findOne({ user: username }).exec(function (err, sendanyway) {
            if (!sendanyway) {
                res.status(200).json({ error: "Khong tim thay id" });
            }
            if (username == sendanyway.user && password == sendanyway.password) {
                res.cookie('rememberme', '1', {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: true
                });
                res.redirect('/Sendanyway/ConfirmloginPage');
                // res.status(200).json({id:sendanyway.id});
            } else {
                res.send('Wrong username or password');
            }
        });
    },

    shorten: function (req, res) {
        var isEmpty = function (obj) {
            return Object.keys(obj).length === 0;
        }

        cookie = req.cookies;
        console.log(cookie);
        
        if (isEmpty(cookie)) res.notFound();
        var link = req.body.link;

        var urlRes = "localhost:1337/Sendanyway/surl/";
        var url = "";
        var Array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        for (i = 0; i < 6; i++) {
            var number = Math.floor(36 * Math.random());
            url += Array[number];
        }
        console.log(url);
        var url2 = url;
        urlRes += url;
        ShortenLink.findOne()
            .where({ url: url2 })
            .exec(function (err, url2) {
                if (!url2) {
                    ShortenLink.create({ url: url, link: link }).exec(function (err) {
                        if (err) {
                            res.send(500, { error: 'Database error' });
                        }
                    });
                    res.status(200).json({ url: urlRes });
                }
            });
    },

    RedirectPage: function (req, res) {
        var link = "";

        for (i = 17; i < 23; i++) {
            link = link + req.path[i];
        }
        // var link = req.path;
        ShortenLink.findOne()
            .where({ url: link })
            .exec(function (err, url) {
                if (err) return res.serverError(err);
                if (!url) return res.notFound();
                return res.redirect(url.link);upload
            });
    },

    upload: function (req, res) {
        var url = "";
        var Array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        for (i = 0; i < 6; i++) {
            var number = Math.floor(36 * Math.random());
            url += Array[number];
        }
        var urlRes = url;
        req.file('file')
            .upload({

            }, function (err, uploads) {
                if (err) return res.serverError(err);
                if (uploads.length === 0) { return res.badRequest('No file was uploaded') };
                File.create({
                    path: uploads[0].fd,
                    filename: uploads[0].filename,
                    filecode: url,
                }).exec(function (err, file) {

                    if (err) { return res.serverError(err) }
                    // if it was successful return the registry in the response
                    return res.status(200).json({ filecode: urlRes })
                })
            });
    },

    download: function (req, res) {
        var code = req.body.code;
        
        File
            .findOne({ filecode: code })
            .exec((err, file) => {
                if (err) { return res.serverError(err) }
                if (!file) { return res.notFound() }
                res.download(file.path, function (err) {
                    if (err) {
                        return res.serverError(err)
                    } else {
                        // return res.json({status:"ok"})
                        res.view('ok')
                    }
                })
            });
    }
};

