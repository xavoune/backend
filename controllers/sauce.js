const Sauce = require('../models/sauce');
const fs = ('fs');

//route pour obtenir toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
          res.status(200).json(sauces);
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
};

//route pour obtenir une sauce en particulier
exports.getSaucesById = (req, res, next) => {

};

//route pour ajouter une sauce
exports.createSauce = (req, res, next) => {

};

//route pour modifier une sauce
exports.modifySauce = (req, res, next) => {

};

//route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {

};

//route pour liker une sauce
exports.likaASauce = (req, res, next) => {

};