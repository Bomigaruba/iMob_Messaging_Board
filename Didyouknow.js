class Didyouknow {
    constructor() {
      this.randomGenerator = null;
      this.Fax = null;
   
      this.randomGenerator = Math.random();
      this.Fax = [];
      this.facts();
    }
    generateResponse() {
      let index = this.randomGenerator.nextInt(this.Fax.size());
      return this.Fax.get(index);
    }
    facts() {
      this.Fax.append('Did you know?\n' + '\n' + '                         Canadian money smells like maple syrup.');
      this.Fax.append('Did you know?\n' + '\n' + 'The Great Donald Trump is the first ever presidential candidate\n' + '\n' + 'to have lost in the polls in his home state (New York)\n' + '\n' + 'and still win an election by a convincing margin.\n\n                          Moral of the story: Wall climbing anyone?\n');
      this.Fax.append('Did you know?\n' + '\n' + 'Famous French Emperor, Napoleon Bonaparte\'s penis is owned\n' + '\n' + 'by the daugther of famous Urologist John Lattimer (fiesty).\n' + '\n');
      this.Fax.append('Did you know?\n' + '\n' + 'Your SYSC 2004 instructor, Lynn Marshall, who is most popular for her \n' + '\n' + 'exploits in the swimming pool was the childhood hero of 9-time\n' + '\n' + 'Olympic Gold medalist, Micheal Phelps.\n');
      this.Fax.append('Did you know?\n' + '\n' + 'The world is a pretty homophobic place and social media\n' + '\n' + ' is no different. However, If you, as a guy were\n' + '\n' + 'to comment something like \'Oh damn this guy is cute\'\n' + '\n' + 'on one of NBA superstar Kelly Oubre\'s posts\n' + '\n' + 'you won\'t be the only one ;).\n' + '\n' + '                         Moral of story: It ain\'t gay if its Kelly Oubre!');
      this.Fax.append('Did you know?\n' + '\n' + 'In the widely popular TV series, \'The Simpsons\', Ned Flanders:\n' + '\n' + 'a character in the series depicted as an extremely\n' + '\n' + 'religious, good natured man has used profanity(i.e \'fuck\' or \'bitch\')\n' + '\n' + 'on more than one occasion in the show. This when compared to\n' + '\n' + 'serial Delinquint Hell raiser, Bart Simpson, who has never used profanity\n' + '\n' + 'on the show is really eye-opening.');
      this.Fax.append('Did you know?\n' + '\n' + 'Deceased superstar rapper Biggie Smalls AKA Notorious B.I.G\n' + '\n' + 'made a song called \'Juicy\' in August 1994 where he had this\'\n' + '\n' + 'verse: \'You never thougth that Hip-Hop would take it this far\n' + '\n' + '           Now I\'m in the limelight cause I rap tight\n' + '\n' + '           Time to get paid, blow up like the World trade\'.\n' + '\n' + 'I know what your thinking................and Yes!\n' + '\n' + '                          B.I.G predicted 9/11!\n');
      this.Fax.append('Did you know?\n' + '\n' + 'Just like how black people were discriminated against for\n' + '\n' + 'the most part of North American history, Ginger-haired people\n' + '\n' + 'suffer similar ridicule in society. Don\'t believe me? \n' + '\n' + 'If you rearrange the letters \'G-I-N-G-E-R\', you get \'N-I-G-G-E-R\'.\n' + '\n' + 'Moral of the story: They weren\'t lying when they said\n\n\'Orange is the new Black\'.\n');
      this.Fax.append('Did you know?\n' + '\n' + 'Barack Obama is actually the second Black president in American\n' + '\n' + 'history. The first was famous revolutionary, leader, and rapist:\n' + '\n' + '                            Bill Clinton.\n');
    }
  }
  module.exports = new Didyouknow();