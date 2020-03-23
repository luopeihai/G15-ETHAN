const { Movie, Music, Sentence } = require("./classic");

class Art {
  static async getData(artId, type, useScope = true) {
    let art = null;
    const finder = {
      where: {
        id: artId
      }
    };

    const scope = useScope ? "bh" : null;
    switch (type) {
      case 100:
        art = Movie.findOne(finder);
        break;
      case 200:
        art = Music.findOne(finder);
        break;
      case 300:
        art = Sentence.findOne(finder);
        break;
      case 400:
        break;
      default:
        break;
    }

    return art;
  }
}

module.exports = {
  Art
};
