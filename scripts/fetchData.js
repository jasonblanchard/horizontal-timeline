import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';

const agent = superagentPromise(superagent, Promise);
const outPath = path.join(__dirname, '../data/data.json');

agent.get('https://spreadsheets.google.com/feeds/list/1xcP0fz7i0IoVuZnnYYqyn0MlA6giltqLXvpjCK7ilXM/od6/public/values?alt=json')
  .end()
  .then(response => {
    const entries = response.body.feed.entry;

    const data = entries.map(entry => {
      const { gsx$name, gsx$start, gsx$end, gsx$type } = entry;
      return {
        name: gsx$name.$t,
        start: gsx$start.$t,
        end: gsx$end.$t,
        type: gsx$type.$t,
      };
    });

    fs.writeFile(outPath, JSON.stringify(data), () => {
      console.log(data);
      console.log(`Written to ${outPath}`);
    });
  });
