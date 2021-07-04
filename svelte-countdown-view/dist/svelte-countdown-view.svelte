<svelte:options accessors={true}/>

<div use:Timer={{ onTick }}>{
  MinutesToGo < 10 ? '0' + MinutesToGo : MinutesToGo
}:{
  SecondsToGo < 10 ? '0' + SecondsToGo : SecondsToGo
}
</div>
<script context=module>
import Timer from 'svelte-timer-action';
</script>
<script>
import expectOrdinal from 'expect-ordinal' // rollup-plugin-svelte wants it so
;
export let Time; // given in seconds
let remainingTime;
$: {
    expectOrdinal('time span', Time);
    remainingTime = Time;
}
$: MinutesToGo = Math.floor(remainingTime / 60);
$: SecondsToGo = remainingTime % 60;
function onTick() {
    if (remainingTime > 0) {
        remainingTime = remainingTime - 1;
    }
}
</script>
<style>
  div {
    display:inline-block; position:relative;
    font-size:32px; font-weight:bold; font-style:italic;
    border:solid 1px; border-radius:4px;
    padding:4px; text-align:center;
  }
</style>
