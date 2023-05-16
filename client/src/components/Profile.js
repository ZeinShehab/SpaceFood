import React, { useState, useEffect } from 'react'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { sendEmail, updateUser, verifyOTP } from '../helper/helper'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css'
import {BsBookmarksFill, BsBookmarks} from 'react-icons/bs'
import {BiFork} from 'react-icons/bi';

export default function Profile() {

  const [file, setFile] = useState();
  const [cert, setcert] = useState();
  const [certName, setName] = useState();
  const [notChef, setNotChef] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const [sentEmail, setSentEmail] = useState(false)
  const [code,setCode] = useState()
  const [verified, setVerified] = useState(false)
  const navigate = useNavigate()
 
  const formik = useFormik({
    initialValues : {
      firstName : apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address : apiData?.address || '',
      certification: apiData?.certification || '',
      role : apiData?.roles || '',
      certificationName : apiData?.certificationName || ''
    },
    enableReinitialize: true,
    validate : profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})

      if (cert != null && verified) {
        values.certification = cert;
        values.certificationName = certName;

        // Set role to chef directly without validation of uploaded file
        values.role ="Chef";
      }
      if (notChef) {
        values.certification = null;
        values.certificationName = "";
        values.role = "User";
      }

      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success : <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      });

    }
  })

  useEffect(() => {
    if (code) {
      handleVerification(apiData?.username, code);
    }
  }, [code]);

  const handleVerification = async (username,code)=>{
    console.log(code)
    try{
      
      const response = await verifyOTP({username,code:parseInt(code)})
      if(response.status ===201){
        setVerified(true)
      }
    }catch(error){
      console.log({error})
    }
  }
  const handleSendEmail = async (username,userEmail)=>{
    try{
      const response = await sendEmail(username,userEmail)
      if(response.status === 200 ){
        setSentEmail(true)
      }
    }catch(error){
      console.log({error})
    }
  }

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  const onUploadCert = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setName(e.target.files[0].name);
    setcert(base64);
    setNotChef(false);
  }

  const onRemoveCert = async e => {
    e.preventDefault();
    setName("");
    setcert(null);
    setNotChef(true);
  }

  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/login');
  }

  function goBack(){
    navigate(-1);
  }

  function goToBookmarks() {
    navigate('/Bookmarks');
  }

  function goToRecipes() {
    navigate('/myrecipes');
  }

  if(isLoading) return <div className='Loading'>Loading</div>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-fit'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "820px", paddingTop: '3em'}}>

          <div className="title flex flex-col items-center">
            <div className="flex gap-40">
              <button onClick={goBack} className='text-orange-500 text-7xl'>←</button>
              <h4 className='text-5xl font-bold pt-5'>Profile</h4>
              <button onClick={userLogout} className='text-orange-500 text-2xl pt-3' to="/login">Logout</button>
              {/* <img src={logout} onClick={goBack} className='w-20 cursor-pointer' to="/"/> */}
            </div>
          <div className='grid'>
            <span className='py-4 text-xl  text-center text-gray-500'>
                You can update the details.
            </span>
            {apiData && apiData.role == "User" || notChef ?
            
              <div className={`${styles.profilebookmark} ${extend.profilebookmark}`} onClick={goToBookmarks}>
              Bookmarks
              <BsBookmarksFill className={`${styles.profilebookmarkicon} ${extend.profilebookmarkicon}`}/>
              </div> :
              <div className='flex gap-10'>
              <div className={`${styles.profilebookmark} ${extend.profilebookmark}`} onClick={goToBookmarks}>
                  Bookmarks
                  <BsBookmarksFill className={`${styles.profilebookmarkicon} ${extend.profilebookmarkicon}`}/>
              </div> 
              <Link to={`/viewPosts/${apiData?.username}`}>
                <div className={`${styles.profilebookmark} ${extend.profilebookmark}`}>
                    My Recipes
                    <BiFork className={`${styles.profilebookmarkicon} ${extend.profilebookmarkicon}`}/>
                </div> 
              </Link>
            </div>
            }
          </div>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <label htmlFor="profile">
                    <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-3">
                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('firstName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='FirstName' />
                  <input {...formik.getFieldProps('lastName')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='LastName' />
                </div>

                <div className="name flex w-3/4 gap-10">
                  <input {...formik.getFieldProps('mobile')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Mobile No.' />
                  <input {...formik.getFieldProps('email')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
                </div>
               
                  <input {...formik.getFieldProps('address')} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Address' />
               
                  <div className={`${styles.chefform} ${extend.chefform}`}>
                  
                    <div className='flex gap-11'>
                      <h3 className='label flex w-3/4'>Upload a certificate to become a chef and post recipes.</h3>
                      <label for="certName" className={`${styles.label} ${extend.label}`}>{ notChef ? certName : (apiData?.certificationName || certName)}</label>
                    </div>
                    
                    <div className='flex gap-10'>
                      <label for="file" className={`${styles.btnsmall} ${extend.btnsmall}`}>Upload</label>
                      <button className={`${styles.btnremove} ${extend.btnremove}`} onClick={onRemoveCert}>Remove</button>
                    </div>
                  
                  <input {...formik.getFieldProps('certification')} value = {null}className={`${styles.textbox} ${extend.textbox}`} type="file" id="file" name="file" onChange={(event)=>{onUploadCert(event); handleSendEmail(apiData?.username,apiData?.email)}}/>
                  {sentEmail&&<h1>Please check you email for your verification code and enter it here</h1>&&

                  <input className='flex gap-10'
                    type="number"
                    onBlur={(event) => {setCode(event.target.value);handleVerification(apiData?.username, code)}}
                    name="otp"
                    placeholder="Enter Code"
                    pattern='\d{6}'
                    maxLength="6"
                  />
                  }
                  {
                    verified&&<h1>Thank you for becoming a chef. Please <b>save your changes.</b></h1>
                  }
                </div>
                  
                <button className={styles.btn} type='submit'>Save Changes</button>
              </div>

              

          </form>

        </div>
      </div>
    </div>
  )
}

