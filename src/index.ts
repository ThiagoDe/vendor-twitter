import {
  dynamodbDescribeTable,
  dynamodbScanTable,
  dynamodbUpdateTweet,
  getAllScanResults,
  sqsSendMessage,
} from './aws'
import dotenv from 'dotenv'
import { Vendor } from './types/vendor'
import { setRules } from './twitter'
import { Rule } from './types/twitter'

dotenv.config()

const init = async () => {
  //    const res = await dynamodbDescribeTable('vendors')

  //    console.log(res)
  // const scanIterator = await dynamodbScanTable('vendors', 5)
  // console.log((await scanIterator.next()).value)
  // console.log((await scanIterator.next()).value)

  // const res = await dynamodbUpdateTweet(
  //   process.env.AWS_VENDORS_TABLE_NAME ?? '',
  //   {
  //     id: 'tweet1',
  //     userId: 'DCTacoTruck',
  //     userName: 'DC Taco Truck',
  //     text: 'Test tweet',
  //     date: '02/07/23',
  //     geo: {
  //       id: 'geo1',
  //       name: 'Geo location 1',
  //       place_type: 'place 1',
  //       full_name: 'place 1',
  //       country: 'USA',
  //       country_code: 'USA',
  //       coordinates: {
  //         lat: 34.01283,
  //         long: 41.1818,
  //       },
  //     },
  //   },
  //   'DCTacoTruck'
  // )

  // await sqsSendMessage(
  //   'https://sqs.us-east-1.amazonaws.com/686406804576/testqueue1','testmessage1'
  // )
  const vendors = await getAllScanResults<Vendor>(
    process.env.AWS_VENDORS_TABLE_NAME ?? ''
  )
  const vendorList = vendors.map((vendor) => vendor.twitterId)
  const rules: Rule[] = [
    {
      value: `has:geo (from:${vendorList.join(' OR from:')})`,
      tag: 'vendors-geo'
    },
  ]
  await setRules(rules)
}

init()
