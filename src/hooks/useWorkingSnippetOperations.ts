import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { WorkingSnippetOperations } from "../utils/mock/workingSnippetOperations";


export const useWorkingSnippetOperations= ()=>{

    const auth0 = useAuth0()
    const [token, setToken] = useState('')
    const [nickname,setNickname ] = useState('')

    useEffect(()=>{
        auth0.getAccessTokenSilently().then((token)=>setToken(token))
        auth0.getIdTokenClaims().then((token)=> {
            setNickname(token.nickname)})
    },[])

    return new WorkingSnippetOperations(token, nickname)
}