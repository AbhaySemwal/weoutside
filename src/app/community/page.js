"use client"
import Footer from '@/components/footer/Footer'
import GetCookie from '@/components/getCookie/GetCookie'
import LeftSection from '@/components/leftsection/LeftSection'
import Navbar from '@/components/navbar/Navbar'
import Topbar from '@/components/topbar/Topbar'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CommunityPage = () => {
    const token=typeof window !== "undefined" ? GetCookie("token")  : null;
    const router=useRouter();
    const [user,setUser]=useState("");
    const [size,setSize]=useState(0)
    const [loading,setLoading]=useState(true)

    useEffect(() => {
      if (!token) {
        router.push("/login");
      }
      else
      {
        setUser(typeof window !== "undefined" ? JSON.parse(GetCookie(token)):null);
      }
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [posts, setPosts] = useState([]);
    

  useEffect(() => {

    const getPosts = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          "https://we-out-backend.vercel.app/api/posts?page=" + currentPage,
          { headers: { Authorization: token } }
        );
        const data = res.data.formattedPosts;
        setSize(res.data.size)
        setPosts(data);
        setFilteredPosts(data)
        setLoading(false)
      } catch (err) {
        setLoading(false)
      }
    };
    getPosts();
  }, [currentPage]);
  
  const onSearch = (query) => {
    if (query.trim() === "") {
        setFilteredPosts(posts);
    } else {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||  
            post.content.toLowerCase().includes(query.toLowerCase()) ||  
            (post.user && post.user.toLowerCase().includes(query.toLowerCase()))  
        );
        setFilteredPosts(filtered);
    }
};

  return (
    <div className='w-full'>
        <Navbar/>
        <div className='w-full md:px-0'>
            <div className='md:w-10/12 mx-auto px-2 flex flex-col justify-center items-center my-5'>
                <div className='w-full md:w-[65%]'>
                <Topbar onSearch={onSearch} user={user}/>
                    <LeftSection loading={loading} token={token} user={user} posts={filteredPosts} size={size} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
                </div>
            </div>
            <div className='py-10 px-2 bg-[#190808]'>
              <div className='md:w-10/12 mx-auto '>
                <Footer/>
              </div>
            </div>
        </div>
    </div>
  )
}

export default CommunityPage