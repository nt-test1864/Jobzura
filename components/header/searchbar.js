import SearchIc from "./../icons/Search";
import Autocomplete from "react-autocomplete"
import { useState } from 'react'
import { skills } from '../../data/skills'
import { useRouter } from 'next/router';
import axios from "axios";
import { useQuery } from "react-query";

function Searchbar(props) {
  const [search, setSearch] = useState('')
  const [isSearchVisible, setSearchVisible] = useState(false)
  const router = useRouter()

  const filter = (event) => {
    if(event.code === 'Enter') {
      var category = skills.find(catName => catName.skill.toLowerCase() === search.toLowerCase())
      var categoryUrl = category ? '&category=' + category.category : ''
      // if search start with a 0x, it's an address search 
      if(search.startsWith('0x')) {
        router.push(`/find-talent/users?user=${search}`)
      } else {
        router.push(`/find-talent/jobs?skill=${search.toLowerCase()}${categoryUrl.toLowerCase()}`)
      }
    }
  }

  const fetchAllUsers = async () => {
    const { data } = await axios.get("/api/get/AllUsers");
    return data;
  };

  const { data: users, isLoading } = useQuery("users", fetchAllUsers, {
    refetchOnWindowFocus: false,
  });

  const allSkills = skills.map(skill => skill.skill)
  const allUsers = users ? users.map(user => user.name.userAddress) : []
  const all = [...allSkills, ...allUsers]

  const uniqueValues = [...new Set(all)]

  return (
    <div className="searchContainer">
      <i className="searchIcon">
        <SearchIc size={14} />
      </i>
      <Autocomplete
        items={uniqueValues}
        shouldItemRender={(item, value) => item.toLowerCase().indexOf(value.toLowerCase()) > -1}
        getItemValue={item => item}
        renderItem={(item) =>
          <div
            key={item}
            className="autoSuggestDropdown"
          >
            {item}
          </div>
        }
        value={search}
        onChange={e => setSearch(e.target.value)}
        onSelect={value => setSearch(value)}
        renderInput={function (props) {
          return <input {...props} placeholder="What services or users are you looking for today?"
            className="searchControl" onKeyDown={filter}/>
        }}
      />
    </div>
  );
}

export default Searchbar;
