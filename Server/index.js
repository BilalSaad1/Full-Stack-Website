const express = require('express'); 
const path = require('path')
const Joi = require('joi')
const HeroList = require('./HeroList')
const connectDB = require('./db');
const authRoutes = require('./authorize');
const verfifyRoute = require('./Verify')
const User = require('./User')
const Policy = require('./Policy');
const app = express(); 
const port = 3000; 
const router = express.Router();
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use('/api/authorize', authRoutes);
app.use('/api/authorize/verify', verfifyRoute);


const publicPath = path.join(__dirname, '..', 'public', 'components');
app.use(express.static(publicPath));

connectDB()

const shinfo = require('./superhero_info.json');
const shpowers = require('./superhero_powers.json')
app.use ('/api/superhero-info', router);

app.post('/api/hero-lists/:name', async (req, res) => {
  const { id: heroIds, description, visibility, rating, reviewText } = req.body;
  const listName = req.params.name;

  const schema = Joi.object({
      id: Joi.array().items(Joi.number()).required(),
      rating: Joi.number().min(1).max(10)
  });

  const { error } = schema.validate({ id: heroIds, rating });
  if (error) {
      return res.status(400).send(error.details[0].message);
  }

  let missingHeroIds = [];
  const heroes = heroIds.map(id => {
      const hero = shinfo.find(h => h.id === id);
      if (!hero) {
        missingHeroIds.push(id); 
        return null;
      }
      const powers = shpowers.find(p => p.hero_names === hero.name);
      return { ...hero, powers: powers };
  });
  if (missingHeroIds.length > 0) {
    return res.status(404).send({ message: `Superheroes with IDs ${missingHeroIds.join(', ')} not found.` });
}

try {
  let heroList = await HeroList.findOne({ name: listName });
  console.log(heroList)
  if (heroList) {
    console.log("jey")
      heroList.heroes = heroIds
      heroList.description = description
      heroList.visibility = visibility
      if (rating !== undefined && reviewText) { 
        heroList.reviews.push({ rating, review: reviewText });
      }
  } else {
    console.log("asdasy")
      heroList = new HeroList({
          name: listName,
          heroes: heroIds,
          description,
          visibility,
          reviews: rating !== undefined && reviewText ? [{ rating, review: reviewText }] : []
        });
  }
  console.log("HEY")
  await heroList.save();
  console.log(heroList)
  res.json(heroList);
}catch (err) {
  console.error(err);
  res.status(500).send('Server error');
}
});

app.get('/api/hero-lists/public', async (req, res) => {
  try {
      const publicLists = await HeroList.find({ visibility: 'public' });
      res.json(publicLists);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.get('/api/hero-lists', async (req, res) => {
  try {
      const lists = await HeroList.find({});
      res.json(lists);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.get('/api/users', async (req, res) => {
  try{
    const users = await User.find({})
    res.json(users)
  }catch(error){
    console.error(error)
    res.status(500).send('Server error')
  }
})

app.patch('/api/hero-lists/:listId/reviews/:reviewId', async (req, res) => {
  try {
      const { listId, reviewId } = req.params;
      const list = await HeroList.findById(listId);
      const review = list.reviews.id(reviewId);
      review.flagged = !review.flagged;
      await list.save();
      res.json(list);
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.patch('/admin/deactivate/:userId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      user.isdeactivated = true;
      await user.save();
      res.send('Account deactivated');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.patch('/admin/reactivate/:userId', async (req, res) => {
  try {
      const user = await User.findById(req.params.userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      user.isdeactivated = false;
      await user.save();
      res.send('Account reactivated');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.patch('/admin/grantadmin/:userId', async (req, res) => {
  try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send('User not found');
      }
      user.isAdmin = !user.isAdmin;
      await user.save();
      res.json({ msg: `Admin status updated for user ${user.username}` });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.delete('/api/hero-lists/:name', async (req, res) => {
  try {
      const { name } = req.params;
      const list = await HeroList.findOneAndDelete({ name: name });
      if (!list) {
          return res.status(404).send('List not found');
      }
      res.send('List deleted successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
  }
});

app.post('/api/policies/:type', async (req, res) => {
  const { content } = req.body;
  const { type } = req.params
  let policy = await Policy.findOne({ type });

  if (policy) {
      policy.content = content;
  } else {
      policy = new Policy({ type, content });
  }

  await policy.save();
  res.json({ message: 'Security policy updated successfully' });
});

app.get('/api/policies/:type', async (req, res) => {
  const { type } = req.params;
  const policy = await Policy.findOne({ type });

  if (!policy) {
      return res.status(404).send(`${type} policy not found`);
  }
  res.json(policy);
});

app.get('/api/policieslist', async (req, res) => {
  try{
    const policies = await Policy.find({})
    res.json(policies)
  }catch(error){
    console.error(error)
    res.status(500).send('Server error')
  }
})

app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() } 
  });

  if (!user) {
    return res.status(400).send('Invalid or expired token');
  }

  
  user.isEmailVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.send('Email successfully verified');
});

router.get('/search', (req, res) => {
const query = req.query;
if (Object.keys(query).length === 0) {
    res.status(400).send('Error 400 bad request, please provide valid parameters.');
    return;
}

const foundSuperheroes = shinfo.filter((sh) => {
    for (const key in query) {
        if (query[key] !== '') {
            const searchKey = key.toLowerCase().replace(/\s+/g, '');
            const superheroValue = String(sh[searchKey]).toLowerCase();
            const queryValue = query[key].toLowerCase();

            if (!superheroValue.includes(queryValue)) {
                return false;
            }
        }
    }
    return true;
}).map((hero) => {
    const heroPowers = shpowers.find(p => p.hero_names === hero.name);
    return { ...hero, powers: heroPowers };
});

if (foundSuperheroes.length > 0) {
    res.json(foundSuperheroes);
} else {
    res.status(404).send('Error 404 no superheroes found.');
}
});
  
  
  router.get('/publishers', (req, res)=>{
    const pubslihers = Array.from(new Set(shinfo.map(hero => hero.publisher)))
    res.send(pubslihers)
  })

  router.get('/:id', (req, res) =>{ 
    const id = req.params.id;
    const shid = shinfo.find(s => s.id === parseInt(id));
    console.log(`Get request for ${req.url}`);
    if(shid){
        res.send(shid);
    }else{
        res.status(404).send(`Error 404 ${id} was not found`);
    }
}); 

app.listen(port, () => { 
    console.log(`Listening to Port ${port}`); 
});