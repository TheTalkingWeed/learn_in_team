export default function Answer(props : any){
    return(
    <div className="h-9 bg-red w-full">
        {props.answer.text}
    </div>
    )
}