import needle from 'needle'
import dotenv from 'dotenv'
import { Rule } from './types/twitter'

dotenv.config() 

//env
const TOKEN = process.env.TWITTER_API_BEARER_TOKEN ?? ''

// URLS
const RULES_URL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const STREAM_URL =
  'https://api.twitter.com/2/tweets/search/stream?tweet.fields=attachments,author_id,context_annotations,conversation_id,created_at,edit_controls,edit_history_tweet_ids,entities,geo,id,in_reply_to_user_id,lang,non_public_metrics,organic_metrics,possibly_sensitive,promoted_metrics,public_metrics,referenced_tweets,reply_settings,source,text,withheld&expansions=attachments.media_keys,attachments.poll_ids,author_id,edit_history_tweet_ids,entities.mentions.username,geo.place_id,in_reply_to_user_id,referenced_tweets.id,referenced_tweets.id.author_id&media.fields=alt_text,duration_ms,height,media_key,non_public_metrics,organic_metrics,preview_image_url,promoted_metrics,public_metrics,type,url,variants,width&poll.fields=duration_minutes,end_datetime,id,options,voting_status&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type'


// Set rules for the twitter stream 
export const setRules = async (rules: Rule[]) => {
    try {
        const res = await needle('post', RULES_URL, {
            'add': rules
        }, {
            headers: {
                'content-type': 'application/json',
                'authorization':  `Bearer ${TOKEN}`
            }
        })
        console.log(res, 'res')
        if (res.statusCode !== 201) {
            throw new Error(`setRules error response ${res.statusCode} ${res.statusMessage}`)
        }

        console.log('Rules Set!')
        return res.body
    } catch(e) {
        if (e instanceof Error) {
            throw e
        }
    }
    throw new Error('setRules unexpected error')
    
}