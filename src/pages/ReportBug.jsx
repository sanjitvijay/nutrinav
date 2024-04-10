import { useState } from "react";
import supabaseClient from "../supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function ReportBug() {
    const supabase = supabaseClient()
    const [form, setForm] = useState('')
    const navigate = useNavigate()

    const onSubmit = async (e) => {
        e.preventDefault() 

        if(form.length >= 1000){
            toast.error("Description must be less than 1000 characters")
            return 
        }
        const {data, error} = await supabase
        .from('internal')
        .insert({bug: form})

        if (error) {
            toast.error("Failed to submit bug");
        } else {
            toast.success("Bug submitted successfully");
            setTimeout(()=>{navigate('/dashboard')}, 1000)
        }
    }
    return (
        <div className="card px-10 py-5 border-2 shadow-md">
            <p className="text-center mb-5">
                    Enter a description of the bug below or email <a className="text-secondary"href="mailto:nutrinav24@gmail.com">nutrinav24@gmail.com</a>
                </p>
            <form onSubmit={onSubmit}>
                <div className="form-control mb-5">
                    <textarea 
                        className="textarea textarea-bordered" 
                        placeholder="Enter a description of the bug (1000 characters or less)"
                        value={form}
                        onChange={(e)=>setForm(e.target.value)}
                    />
                </div>
                
                <div className="flex justify-center">
                    <button 
                        className="btn btn-primary text-white" 
                        type="submit"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
               
                    
            </form>
            
        </div>
    );
}

export default ReportBug;