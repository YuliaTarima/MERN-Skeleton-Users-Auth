# MERN KICKSTART

#### What you need to run this code
1. Node (13.12.0)
2. NPM (6.14.4) or Yarn (1.22.4)
3. MongoDB (4.2.0)

####  How to run this code
1. Clone this repository
    - open command line and cd to the desired location
    - ```  git clone git@github.com:YuliaTarima/MERN-Kickstart-Skeleton.git  ```
2. Install dependencies:
   - open command line in the cloned folder
   - run ```  npm install  ``` or ``` yarn ```
3. Run the appliaction in the desired mode:
   - to run in the dev mode:<br/>
   ```  npm run development  ``` or ``` yarn development ```<br/> 
   will get Nodemon, Webpack, and the server started for development
   - ```  npm run build  ``` or ``` yarn build ```<br/>
   will generate the client and server code bundles for production mode<br/> 
   (remove the devBundle.compile code from server.js before running this script)
   - ```  npm run start  ``` or ``` yarn start ```<br/>
   will run the bundled code in production
4. Open [localhost:3000](http://localhost:3000/) in the browser
5. Start developing

####  How to update dependencies
 1.   ```  npx npm-check-updates -u  ```<br/>
    ```  npm install  ``` or clean install ```  rm -rf node_modules  ``` <br/> 
    or<br/>
    ```  npm outdated  ```<br/>
    ```  npm update  ``` <br/> 
    ```  npm install  ``` or clean install ```  rm -rf node_modules  ``` 
2. Save exact versions to npm-shrinkwrap.json with npm shrinkwrap
   ```  rm npm-shrinkwrap.json  ```<br/>
   ```  npm shrinkwrap  ```<br/>
   npm install will now use exact versions in npm-shrinkwrap.json<br/>
   If you check npm-shrinkwrap.json into git, all installs will use the exact same versions.<br/>
   This is a way to transition out of development (all updates, all the time) to production (nobody touch nothing).  
3. Note: update in npm modules might require changes for the application to
 continue working