import axios from 'axios'

const _defaultMessage = 'Search for the movie title!'

export default {
    namespaced : true,
    state:() => ({
        movies:[],
        message:_defaultMessage,
        loading: false,
        theMovie:{}
    }),
    getters:{
        moviIds(state){
            return state.movies.map(m=>m.imdbID)
        }
    },
    mutations:{
        updateState(state, payload){
            Object.keys(payload).forEach(key =>{state[key] = payload[key]})
            
        },
        resetMovies(state) {
            state.movies = []
            state.message = _defaultMessage
            state.loading = false
        }
    },
    actions: {
        async searchMovies({commit, state}, payload){
            if(state.loading) return

            commit('updateState',{
                message: '',
                loading: true
            })
            try {
                const res = await _fetchMovie({...payload,page:1})
                const {Search, totalResults} = res.data
    
                commit('updateState', {
                    movies: Search  
                })
    
                const total = parseInt(totalResults, 10)
                const pageLength = Math.ceil(total / 10)
                
                if(pageLength > 1){
                    for (let page = 2 ; page <= pageLength; page +=1){
                        if(page > payload.number / 10) break
    
                        const res = await _fetchMovie({...payload,page})
                        const {Search} = res.data
                        commit('updateState', {
                            movies: [...state.movies, ...Search],   
                        })
                    }
                }
            } catch (message) {
                commit('updateState', {movie:[],message})
            } finally {
                commit('updateState', {loading:false})
            }
           
        },
        async searchMoviesWithId({state, commit}, payload){

            if(state.loading) return

            commit('updateState', {theMovie:{},loading:true})

            try {
                const res = await _fetchMovie(payload)
                commit('updateState', {theMovie:res.data})
                console.log(res)
            } catch (error) {
                commit('updateState', {theMovie:{}})
                
            } finally {
                commit('updateState', {loading:false})
            }
            
        }
    }

}


function _fetchMovie(payload){



    const {title, type,  year, page, id} = payload
            const OMDB_API_KEY = '7035c60c'
 
    const url = id 
    ? `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
    : `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
    
    

    return new Promise((resolve, reject) => {
        axios.get(url)
        .then((res) => {
            if(res.data.Error)
                reject(res.data.Error)
            resolve(res)

        })
        .catch(err => reject(err.message))
    })
        
}