import fs from 'fs';
import arg from 'arg';
import path from 'path';
import DrozdInit from '../platforms/node';
import {logger} from '../basic/Log'
import {dashboard} from './dashboard';
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
    {
        '--dashboard': Boolean,
        '--daemon': Boolean
    },
    {
        argv: rawArgs.slice(2),
    }
    );

    var path = '';

    if(rawArgs[2] && rawArgs[2].search('--')) {
        path = rawArgs[2];
    }

    return {
        path:  path,
        dashboard: args['--dashboard'] || false,
        daemon: args['--daemon'] || false
    };
}

export async function main(args) {

    logger.log('info', "===== System started at " + Date.now());

    const options = parseArgumentsIntoOptions(args);

    try {
        await DrozdInit.setupHost();
        const env = await DrozdInit.setupEnvironment();
        await DrozdInit.initWebports(env);
    } catch (error) {
        logger.error('Drozd initialization failed: ' + error);
    }

    if(options.dashboard) {

        try {
            logger.disable();
            dashboard(env);
        } catch (error) {
            logger.error('Failed to start dashboard');
        }

    } else
    if(options.daemon) {
        logger.disable();
    }

    if(options.path !== '') {

        const fullpath = path.join(process.cwd(), options.path);

        try {

            if(fs.existsSync(fullpath)) {

                logger.info("Loading service from path " + fullpath);

                const {setup} = await import(fullpath);

                await setup(env);

            } else {
                throw Error('File not found');
            }
        } catch (error) {
            logger.error(chalk.red("Failed to setup service module at \'" + options.path + '\': ' + error.stack));
            process.exit(1);
        }
    } else {
        logger.log('info', "No service defined, running environment basics only");
    }

}
