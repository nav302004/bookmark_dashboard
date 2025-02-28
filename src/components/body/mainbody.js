import React, { useContext, useEffect, useState } from "react";
import styles from "./mainbody.module.css"
import Search from "./search";
import CatogoryShow from "./catogoryshow"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase-config'
import Modal from "./newbookmarkModal"
import ctx from "../../store/context-config"
import Nodatafound from "./nodatafound";


const Body = () => {
    const [bookmark, setBookmarks] = useState([])
    const [showModal, setshowModal] = useState(false)
    const reqCtx = useContext(ctx)
    useEffect(() => {
        const bookmarkcollectionRef = collection(db, "bookmarks")
        const getbookmarksData = async () => {
            try {
                const bookmarksdata = await getDocs(bookmarkcollectionRef)
                const data = bookmarksdata.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                if (reqCtx.selectedCatogory === "") {
                    // console.log("NO catogory selected")
                    setBookmarks(data)
                } else {
                    // console.log("one catogory Selected") 
                    const filterData = data.filter((val) => {
                        return val.catogory === reqCtx.selectedCatogory;
                    })
                    setBookmarks(filterData)
                }
            } catch (error) {
            }
        }
        getbookmarksData()
    }, [reqCtx])

    const modalToggler = () => {
        setshowModal(!showModal)
    }

    return (
        <div className={styles.body}>
            {reqCtx.isModal && <Modal toogler={modalToggler} />}
            <div className={styles.staticbody}>
                <div className={styles.staticbody_top}>
                    <div className={styles.staticbody_top_text}>
                        <h1>Welcome user</h1>
                        <small>Hello! Glad to see you <br /> Store all of you bookmark here without limitation</small>
                    </div>
                    <button onClick={reqCtx.setisModal} >Create New</button>
                </div>
                <Search />
            </div>
            <div className={styles.dynamicbody}>
                {bookmark.length === 0 && <Nodatafound/>}
                {bookmark.map((value) => {
                    return (
                        <CatogoryShow name={value.name} key={value.id} description={value.description} link={value.link} />
                    )

                })}
            </div>
        </div>
    )
}

export default Body