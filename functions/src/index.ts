import ITopic from "./interfaces/ITopic";
import IQuestion from "./interfaces/IQuestion";
import IAnswer from "./interfaces/IAnswer";
import IUser from "./interfaces/IUser";

const functions = require("firebase-functions");
const admin = require("firebase-admin");

var serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const app = express();
const db = admin.firestore();
app.use(cors({ origin: true }));

//Post
//Topics
app.post("/api/topics", (req: any, res: any) => {
  (async () => {
    try {
      await db
        .collection("topics")
        .doc("/" + req.body.id + "/")
        .create({
          id: req.body.id,
          title: req.body.title,
          parent_id: req.body.parent_id,
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Question

app.post("/api/questions", (req: any, res: any) => {
  (async () => {
    try {
      await db
        .collection("questions")
        .doc("/" + req.body.id + "/")
        .create({
          id: req.body.id,
          title: req.body.title,
          text: req.body.text,
          topic_id: req.body.topic_id,
          posted_user_id: req.body.posted_user_id,
          posted_time: req.body.posted_time,
          up_voted_by: req.body.up_voted_by,
          down_voted_by: req.body.down_voted_by,
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Answer
app.post("/api/answers", (req: any, res: any) => {
  (async () => {
    try {
      await db
        .collection("answers")
        .doc("/" + req.body.id + "/")
        .create({
          id: req.body.id,
          text: req.body.text,
          question_id: req.body.question_id,
          answered_user_id: req.body.answered_user_id,
          answered_date: req.body.answered_date,
          approved: req.body.approved,
          up_voted_by: req.body.up_voted_by,
          down_voted_by: req.body.down_voted_by,
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//user
app.post("/api/users", (req: any, res: any) => {
  (async () => {
    try {
      await db
        .collection("users")
        .doc("/" + req.body.id + "/")
        .create({
          id: req.body.id,
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          title: req.body.title,
          gender: req.body.gender,
          born_date: req.body.born_date,
        });

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get
//Topics
app.get("/api/topics", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("topics");
      let response: Array<ITopic> = [];

      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          response.push({
            id: doc.id,
            title: doc.data().title,
            parent_id: doc.data().parent_id,
          });
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get topic by Id
app.get("/api/topics/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("topics").doc(req.params.id);
      let resData = await document.get();
      let response = resData.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Questions

app.get("/api/questions", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("questions");
      let response: Array<IQuestion> = [];

      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          response.push({
            id: doc.id,
            title: doc.data().title,
            text: doc.data().text,
            topic_id: doc.data().topic_id,
            posted_user_id: doc.data().posted_user_id,
            posted_time: doc.data().posted_time,
            up_voted_by: doc.data().up_voted_by,
            down_voted_by: doc.data().down_voted_by,
          });
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get question by id
app.get("/api/questions/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("questions").doc(req.params.id);
      let resData = await document.get();
      let response = resData.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get questions by topic id
app.get("/api/questions_by_topic/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("questions");
      let response: Array<IQuestion> = [];
      let topic_id = req.params.id;
      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          if (parseInt(doc.data().topic_id) === parseInt(topic_id)) {
            response.push({
              id: doc.id,
              title: doc.data().title,
              text: doc.data().text,
              topic_id: doc.data().topic_id,
              posted_user_id: doc.data().posted_user_id,
              posted_time: doc.data().posted_time,
              up_voted_by: doc.data().up_voted_by,
              down_voted_by: doc.data().down_voted_by,
            });
          }
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//Get questions by posted user id
app.get("/api/questions_by_user/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("questions");
      let response: Array<IQuestion> = [];
      let posted_user_id = req.params.id;
      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          if (
            parseInt(doc.data().posted_user_id) === parseInt(posted_user_id)
          ) {
            response.push({
              id: doc.id,
              title: doc.data().title,
              text: doc.data().text,
              topic_id: doc.data().topic_id,
              posted_user_id: doc.data().posted_user_id,
              posted_time: doc.data().posted_time,
              up_voted_by: doc.data().up_voted_by,
              down_voted_by: doc.data().down_voted_by,
            });
          }
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//Answers
app.get("/api/answers", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("answers");
      let response: Array<IAnswer> = [];

      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          response.push({
            id: doc.id,
            text: doc.data().text,
            question_id: doc.data().question_id,
            answered_user_id: doc.data().answered_user_id,
            answered_date: doc.data().answered_date,
            approved: doc.data().approved,
            up_voted_by: doc.data().up_voted_by,
            down_voted_by: doc.data().down_voted_by,
          });
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get Answer by id
app.get("/api/answers/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("answers").doc(req.params.id);
      let resData = await document.get();
      let response = resData.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//Get Answer by Question id
app.get("/api/answers_by_question/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("answers");
      let response: Array<IAnswer> = [];
      let question_id = req.params.id;

      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          if (parseInt(doc.data().question_id) === parseInt(question_id)) {
            response.push({
              id: doc.id,
              text: doc.data().text,
              question_id: doc.data().question_id,
              answered_user_id: doc.data().answered_user_id,
              answered_date: doc.data().answered_date,
              approved: doc.data().approved,
              up_voted_by: doc.data().up_voted_by,
              down_voted_by: doc.data().down_voted_by,
            });
          }
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get users
app.get("/api/users", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("users");
      let response: Array<IUser> = [];

      await document.get().then((querySnapshot: any) => {
        let docs = querySnapshot.docs;

        for (let doc of docs) {
          response.push({
            id: doc.id,
            email: doc.data().email,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name,
            username: doc.data().username,
            title: doc.data().title,
            profile_picture: doc.data().profile_picture,
            gender: doc.data().gender,
            born_date: doc.data().born_date,
          });
        }

        return response;
      });

      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Get user by id

app.get("/api/users/:id", (req: any, res: any) => {
  (async () => {
    try{
      const document = db.collection("users").doc(req.params.id);
      let resData = await document.get();
      let response = resData.data();
      return res.status(200).send(response);
    }catch(error){
      console.log(error);
      return res.status(500).send(error);
    }
  });
});
//Get user by email
app.get("/api/user_by_email/:email", async (req: any, res: any) => {
  try {
    const document = db.collection("users");
    const email = req.params.email;
    let response: IUser | any = null;

    const querySnapshot = await document.get();
    const docs = querySnapshot.docs;

    for (let doc of docs) {
      if (doc.data().email === email) {
        response = {
          id: doc.id,
          email: doc.data().email,
          first_name: doc.data().first_name,
          last_name: doc.data().last_name,
          username: doc.data().username,
          title: doc.data().title,
          profile_picture: doc.data().profile_picture,
          gender: doc.data().gender,
          born_date: doc.data().born_date
        };
        break;
      }
    }

    if (response) {
      return res.status(200).send(response);
    } else {
      return res.status(404).send({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

//Delete
//Delete topic
app.delete("/api/topics/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("topics").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Delete question
app.delete("/api/questions/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("questions").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});
//Delete answer
app.delete("/api/answers/:id", (req: any, res: any) => {
  (async () => {
    try {
      const document = db.collection("answers").doc(req.params.id);

      await document.delete();

      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//Update
app.put("/api/questions/:id", (req: any, res: any) => {
  (async () => {
    try {

      const document = db.collection('questions').doc(req.params.id)

      await document.update({
        id: req.body.id,
          title: req.body.title,
          text: req.body.text,
          topic_id: req.body.topic_id,
          posted_user_id: req.body.posted_user_id,
          posted_time: req.body.posted_time,
          up_voted_by: req.body.up_voted_by,
          down_voted_by: req.body.down_voted_by, 
      })
      
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

//uopdate answer
app.put("/api/answers/:id", (req: any, res: any) => {
  (async () => {
    try {

      const document = db.collection('answers').doc(req.params.id)

      await document.update({
        id: req.body.id,
        text: req.body.text,
        question_id: req.body.question_id,
        answered_user_id: req.body.answered_user_id,
        answered_date: req.body.answered_date,
        approved: req.body.approved,
        up_voted_by: req.body.up_voted_by,
        down_voted_by: req.body.down_voted_by, 
      })
      
      return res.status(200).send();
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});


exports.app = functions.https.onRequest(app);
