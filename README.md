### CVS Take Home Assessment:

#Setup

Create a .env file in the root directory of the project

Add your TMDB API key to the ```.env``` file like this:
```TMDB_API_KEY=<YOUR KEY>```

#Running the Application

To start the server:
```npm start```
This will start the server on localhost:3000
You can access the API by going to the URL:
```http://localhost:3000/movies?year=<YYYY>```

Replace <YYYY> with the year you want (eg 2019)


#Testing

To run the unit test cases and verify the code logic:
```npm test```
This will execute the test suite and display the results