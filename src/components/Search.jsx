import React from 'react';

const Search = (props) => {
    const {searchTerm,setSearchTerm} = props;
    return (
        <div className={'search'}>
            <div>
                <img src={"search.svg"} alt="Search"/>
                <input type={"text"} placeholder={"Search through thousands of movies"}
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}/>
            </div>


        </div>
    );
};

export default Search;