import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import * as dotnev from 'dotenv';
dotnev.config();


type Entry = {
    id: string,
    link: string[],
    author: {
        name: string;
    },
    title: string,
    updated: string,
    published: string,
    'app:edited': string,
    summary: string,
    content: string,
    category: string[],
    'app:control': {
        'app:draft': 'yes' | 'no';
    };
};
type BlogData = {
    entry: Entry,
    [key: string]: any;
};
(async () => {
    const HATENABLOG_API_KEY = process.env.HATENABLOG_API_KEY;
    const HATENABLOG_USERNAME = process.env.HATENABLOG_USERNAME;
    const HATENABLOG_BLOG_ID = process.env.HATENABLOG_BLOG_ID;
    const HATENABLOG_ENTRY_ID = process.env.HATENABLOG_ENTRY_ID;
    const basicAuthHeader = Buffer.from(`${HATENABLOG_USERNAME}:${HATENABLOG_API_KEY}`).toString('base64');
    const xml = await fetch(`https://blog.hatena.ne.jp/${HATENABLOG_USERNAME}/${HATENABLOG_BLOG_ID}/atom/entry/${HATENABLOG_ENTRY_ID}`, {
        headers: {
            'Authorization': `Basic ${basicAuthHeader}`
        }
    }).then(res => res.text());
    const xmlParser = new XMLParser();
    const data = xmlParser.parse(xml) as BlogData;
    console.log(data.entry.content.split('\n').filter(l => l !== ''));
})();