import fs from 'fs';
import * as alt from 'alt';

const eventPath = `${alt.rootDir}/resources/${alt.resourceName}/server/events/`;

const events = fs.readdirSync(eventPath, {encoding: 'utf8'});


events.forEach((evt)=>{
    import '../events/';
});
