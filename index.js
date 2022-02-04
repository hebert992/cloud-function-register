require('dotenv').config();
// Imports the Google Cloud client library
const {PubSub} = require('@google-cloud/pubsub');
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 *
 */
exports.webhook = async (req, res) => {
    const topic = req.query.topic;
    const url = req.query.url;
    const token= req.query.token;
    const localToken = "a80a9ec8-cc99-44b8-9fe7-06c29edbfd08"
    if(token != localToken){
        return res.status(401).send("Token invalid")
    }
    await quickstart(topic,url)
    res.status(200).send("OK");
};
async function quickstart(
    topicName = 'infra-qa', // Name for the new topic to create
    url
) {
    // Instantiates a client
    const  projectId = 'sura-infra'; // Your Google Cloud Platform project ID
    const pubsub = new PubSub({projectId});
    const [listTopics] = await pubsub.getTopics();
    const exist= listTopics.filter(e=>e.name.includes(topicName)).length===1
    let topic=null;
    if(exist){
        topic = await pubsub.topic(topicName)
        await topic.publish(Buffer(JSON.stringify({url})));
    }else{
        let [topic] = await pubsub.createTopic(topicName);
        console.log(`Topic ${topic.name} created.`);
        await topic.publish(Buffer(JSON.stringify({url})));

    }

}
