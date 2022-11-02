<template>
    <div>
        <div class="alphabet">
            <div v-for="(items,key) in lists" :key="key" @click="letterClick">{{key}}
            </div>
        </div>
    </div>
</template>
 
<script>
    export default {
        name: "alphabetList",
        props:{
            lists:Object
        },
        methods:{
            letterClick(e){
                //this.$emit("自定义传递的名称"，"要传递的数据or方法")
                this.$emit("changeLetter",e.target.innerText);
                // console.log(e.target.innerText);
            }
        }
    }
</script>
 
<style scoped>
    .alphabet{
        /*position: absolute;*/
        position: fixed;
        top: 2.2rem;
        right: 0;
        width: 10%;
        color: #28c54d;
        font-size: 0.32rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        z-index: 100;
    }
    .alphabet div{
        padding: 0.08rem 0;
    }
</style>