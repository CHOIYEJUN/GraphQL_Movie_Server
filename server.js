import {ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch";

//Query =>  GET /api/tweets/ - all tweets
//Mutation => POST DELETE PUT /api/tweets/ - create tweet

let tweets =[
    {
        id: "1",
        text: "Hello World",
        auther: "1"
    },
    {
        id: "2",
        text: "Hello World 2",
        auther: "2"
    }
]

let users = [
    {
        id: "1",
        firstName: "Bob",
        lastName: "Bobsky"
    },
    {
        id: "2",
        firstName: "Jill",
        lastName: "Wayne"
    }
]

const typeDefs = gql`

    """
    주석이 달린다니 아주 흥미롭군요
    """
    type Tweet {
        id: ID!
        text: String!
        auther: User
    }
    type Query {
        """
        모두조회
        """
        allMovies: [Movie!]!
        movie(id: Int!): Movie
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        allUsers: [User!]!

    }

    type Mutation {
        """
        추가하는 애
        """
        postTweet(text: String!, userId : ID!): Tweet!
        """
        지우는애
        """
        deleteTweet(id: ID!): Boolean!
    }
    """
    주석이 달린다니 아주 흥미롭군요222
    """
    type User {
        id: ID!
        fullName: String!
        firstName: String!
        lastName: String!
    }

    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
    }


`;

const resolvers = {
    Query : {
        allTweets(){
            return tweets;
        },
        tweet(root, args){
            console.log(args);
            return tweets.find(tweet => tweet.id === args.id);
        },
        allUsers(){
            return users;
        },
        allMovies: async () => {
            return fetch("https://yts.torrentbay.to/api/v2/list_movies.json",{
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((r) => r.json())
                .then((json) => json.data.movies);
        },
        movie(_, {id}) {
            return fetch(`https://yts.torrentbay.to/api/v2/movie_details.json?movie_id=${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((r) => r.json())
                .then((json) => json.data.movie);
        }



    },

    Mutation : {
        postTweet(_, {text, userId}){
            const newTweet = {
                id: (tweets.length + 1).toString(),
                text
            };
            tweets.push(newTweet);
            return newTweet;

        },

        deleteTweet(_, {id}) {
            const tweet = tweets.find(tweet => tweet.id === id);
            if (!tweet) {
                return false;
            }
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;

        },

    },
    User: {
        fullName(user){
            return `${user.firstName} ${user.lastName}`;
        },
    },
    Tweet: {
        auther(tweet) {
            return users.find(user => user.id === tweet.auther);
        }
    },

}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
});