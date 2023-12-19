const Sauce = require('../models/sauce');
const fs = require('fs');

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
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//route pour ajouter une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;

  let imageUrl;

  if (req.file) {
    imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  } else {
    imageUrl = '';
  }

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: imageUrl
  });

  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};

//route pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Not authorized'});
      } else {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
          .then(() => res.status(200).json({message : 'Objet modifié!'}))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({message: 'Not authorized'});
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
            .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
            .catch(error => res.status(401).json({ error }));
        });
      }
    })
    .catch( error => {
      res.status(500).json({ error });
    });
};

//route pour liker une sauce
exports.likeOrDislikeSauce = (req, res, next) => {
  const userId = req.auth.userId;
  const sauceId = req.params.id;
  const like = req.body.like;

  // Vérifiez si l'utilisateur a déjà liké ou disliké la sauce
  Sauce.findOne({ _id: sauceId })
      .then(sauce => {
          if (!sauce) {
              return res.status(404).json({ message: 'Sauce not found' });
          }

          const usersLiked = sauce.usersLiked;
          const usersDisliked = sauce.usersDisliked;

          // Logique pour liker ou disliker
          if (like === 1) {
              if (!usersLiked.includes(userId)) {
                  sauce.likes++;
                  sauce.usersLiked.push(userId);
              }
          } else if (like === -1) {
              if (!usersDisliked.includes(userId)) {
                  sauce.dislikes++;
                  sauce.usersDisliked.push(userId);
              }
          } else if (like === 0) {
              // Annulation du like ou dislike
              if (usersLiked.includes(userId)) {
                  sauce.likes--;
                  sauce.usersLiked.pull(userId);
              } else if (usersDisliked.includes(userId)) {
                  sauce.dislikes--;
                  sauce.usersDisliked.pull(userId);
              }
          }

          // Mettez à jour la sauce dans la base de données
          sauce.save()
              .then(() => res.status(200).json({ message: 'Like/Dislike updated successfully' }))
              .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};