import { app, AppStartContext, AppTerminateContext } from '@azure/functions';
import { graphHandlerCreator} from 'api-graphql';
import { startupObject } from 'api-services';
import { restHandlerCreator } from 'api-rest';
import { StartupObject } from 'api-services-spec';


let startupObj:StartupObject = new startupObject();

app.http(
    'rest', 
    {
        route: 'rest',
        methods: ['GET'],
        handler: restHandlerCreator(startupObj),
    }
);
app.http(
    'graphql',
    {
        handler: graphHandlerCreator(startupObj)
    }
    
)

app.hook.appStart((context: AppStartContext) => {
   // startupObj = new startupObject();
   startupObj.StartUp();
});

app.hook.appTerminate((context: AppTerminateContext) => {
    startupObj.ShutDown();
});


