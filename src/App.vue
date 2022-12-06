<template>
  <h1>
    {{ msg }}
  </h1>

  <Hello />
</template>

<script>
import Hello from '~/components/Hello'

export default {
	// 컴포넌트 등록
	components: {
		Hello,
	},
	data() {
		return {
			msg: 'Hello Vue!',
		}
	},

}
</script>

<style></style>
