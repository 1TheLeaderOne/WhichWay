<template>
	<div class="audio-download-dialog-overlay" @click.self="handleClose">
		<div class="audio-download-dialog">
			<div class="dialog-header">
				<div class="dialog-close" @click="handleClose"></div>
				<div class="dialog-title">选择下载模式</div>
			</div>
			<div class="dialog-content">
				<div class="option-item" @click="selectMode('current')">
					<div class="option-icon current-icon">
						<div class="icon-text">当</div>
					</div>
					<div class="option-info">
						<div class="option-title">下载当前语言</div>
						<div class="option-desc">仅下载当前选择的配音语言</div>
					</div>
				</div>
				<div class="option-item" @click="selectMode('all')">
					<div class="option-icon all-icon">
						<div class="icon-text">全</div>
					</div>
					<div class="option-info">
						<div class="option-title">下载所有可用语言</div>
						<div class="option-desc">下载角色的所有配音语言</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps<{
	onSelect?: (mode: boolean) => void;
	onClose?: () => void;
}>();

const emit = defineEmits<{
	(e: "select", mode: boolean): void;
	(e: "close"): void;
}>();

const handleClose = () => {
	if (props.onClose) {
		props.onClose();
	} else {
		emit("close");
	}
};

const selectMode = (mode: string) => {
	if (props.onSelect) {
		props.onSelect(mode === "all");
	} else {
		emit("select", mode === "all");
	}
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === "Escape") {
		handleClose();
	}
};

onMounted(() => {
	document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.audio-download-dialog-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.7);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.audio-download-dialog {
	width: 400px;
	max-width: 90vw;
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	border: 2px solid #ffa010;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.dialog-header {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	padding: 16px 20px;
	background: linear-gradient(135deg, rgba(255, 160, 16, 0.2) 0%, rgba(255, 160, 16, 0.1) 100%);
	border-bottom: 1px solid rgba(255, 160, 16, 0.3);
	position: relative;
}

.dialog-title {
	color: #ffa010;
	font-size: 24px;
	font-weight: bold;
	text-shadow: 0 0 4px rgba(255, 160, 16, 0.4);
	position: relative;
	margin-left: 3%;
}

.dialog-close {
	width: 24px;
	height: 24px;
	background: url("/extension/WhichWay/image/ui/back.png") center/contain no-repeat;
	cursor: pointer;
	opacity: 0.7;
	transition: opacity 0.2s;
	position: relative;
}

.dialog-close:hover {
	opacity: 1;
}

.dialog-content {
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 12px;
	position: relative;
}

.option-item {
	display: flex;
	align-items: center;
	padding: 16px;
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s;
	position: relative;
}

.option-item:hover {
	background: rgba(255, 255, 255, 0.05);
	border-color: rgba(255, 255, 255, 0.2);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.option-icon {
	width: 48px;
	height: 48px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 16px;
	position: relative;
}

.current-icon {
	background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
}

.all-icon {
	background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
}

.icon-text {
	color: white;
	font-size: 20px;
	font-weight: bold;
}

.option-info {
	flex: 1;
	position: relative;
	display: flex;
	flex-direction: column;
}

.option-title {
	color: #ffffff;
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 4px;
	position: relative;
}

.option-desc {
	color: rgba(255, 255, 255, 0.6);
	font-size: 13px;
	position: relative;
}
</style>
