<script>
import { RouterLink } from "vue-router";

</script>

<template>
    <div>
        <span>問卷調查系統</span>
        <RouterLink to="/"><i class="fa-solid fa-house"></i></RouterLink>
        <RouterLink to="/questionnaire2"><i class="fa-solid fa-gear"></i></RouterLink>
    </div>
    
    


</template>

<style lang="scss" scoped>
div{
    position: fixed;
    top: 0;
    height: 10vh;
    width: 100%;
    background-color: #c8dcec;
    padding: 1% 5%;
    box-shadow: 0 0 8px rgba(102, 175, 233, .6);
    display: flex;
    justify-content: space-between;

    span{
        font-size: 20pt;
        font-weight: 700;
        color: #538cce;
    }

}

i{
    font-size: 25pt;
    color: #769FCD;
}
</style>
