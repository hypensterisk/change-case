/*variables*/
import * as changeCase from 'https://cdn.jsdelivr.net/npm/change-case@5.4.3/dist/index.min.js'
const words=(await(await fetch('https://raw.githubusercontent.com/sindresorhus/word-list/main/words.txt')).text()).split('\n')
$('#output').data('wordList',[])

/*helpers*/
function debounce(func){
  let timeoutID
  return function(...args){
    clearTimeout(timeoutID)
    const callback=()=>func.apply(this,args)
    timeoutID=setTimeout(callback,100)
  }
}
$.fn.extend({setData:function(key,setter){
  const oldData=$(this).data(key)
  const newData=setter(oldData)
  return $(this).data(key,newData)
  .trigger('data',$(this).data())
}})

/*imperative*/
Object.entries(changeCase).forEach(([key,value])=>{
  $($('#option').html()).attr('value',key)
  .text(value(key)).appendTo('#method')
})
$('#input').on('input',debounce(function(){
  const input=$(this).val().toLowerCase()
  $('#list').empty()
  if(!input) return
  words.filter(word=>word.includes(input))
  .sort((a,b)=>a.length-b.length).slice(0,10)
  .forEach(word=>{
    $($('#item').html()).text(word)
    .on('click',()=>{
      $('#input').val('').focus()
      .trigger('input')
      $('#output').setData('wordList',wordList=>[...wordList,word])
    }).appendTo('#list')
  })
})).trigger('input')
$('#method').on('change',()=>$('#output').setData('wordList',wordList=>wordList))
$('#output').on('data',function(_,data){
  const{wordList}=data
  const method=changeCase[$('#method').val()]
  $(this).val(method(wordList.join(' ')))
})
$('#backspace').on('click',()=>$('#output').setData('wordList',wordList=>wordList.slice(0,-1)))
$('#copy').on('click',()=>{
  const output=$('#output')
  navigator.clipboard.writeText(output.val())
  output.setData('wordList',()=>[])
})
new bootstrap.Modal("#modal",{
  backdrop:'static',
  focus:true,
  keyboard:false
}).show()