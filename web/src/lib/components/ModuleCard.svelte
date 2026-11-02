<script lang="ts">
	import type { Module } from '#lib/types.js';
	import Inline from './Inline.svelte';

	interface Props {
		module: Module;
		picked: boolean;
		/** Modules that require this one; it is enabled through them. */
		requiredBy: string[];
		/** Replaced by a custom module of the same name. */
		replaced: boolean;
		onToggle: () => void;
	}

	let { module, picked, requiredBy, replaced, onToggle }: Props = $props();

	const enabled = $derived(picked || requiredBy.length > 0);
	const locked = $derived(!picked && requiredBy.length > 0);
</script>

<div class="card" class:enabled class:locked>
	<label class="main">
		<input type="checkbox" checked={enabled} disabled={locked || replaced} onchange={onToggle} />
		<div class="body">
			<div class="head">
				<span class="name">{module.name}</span>
				{#if module.version}<span class="note">{module.version}</span>{/if}
				{#if locked}<span class="note">needed by {requiredBy.join(', ')}</span>{/if}
				{#if replaced}<span class="note">replaced by your custom module</span>{/if}
			</div>
			<p><Inline text={module.description} /></p>
		</div>
	</label>
	{#if module.tags.length}
		<div class="chips">
			{#each module.tags as tag (tag)}<span class="chip">{tag}</span>{/each}
		</div>
	{/if}
	{#if module.requires.length || module.homepage}
		<div class="foot">
			{#if module.requires.length}
				<details>
					<summary>
						{module.requires.length}
						{module.requires.length === 1 ? 'dependency' : 'dependencies'}
					</summary>
					<ul>
						{#each module.requires as dep (dep)}<li>{dep}</li>{/each}
					</ul>
				</details>
			{/if}
			{#if module.homepage}<a class="homepage" href={module.homepage} target="_blank" rel="noreferrer">homepage</a>{/if}
		</div>
	{/if}
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.8rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		background: var(--surface);
		transition:
			border-color 0.15s,
			background 0.15s;
	}
	.card:hover {
		border-color: var(--accent);
	}
	.card.enabled {
		border-color: var(--accent);
		background: var(--accent-soft);
	}
	.main {
		display: flex;
		gap: 0.7rem;
		align-items: flex-start;
		cursor: pointer;
	}
	.locked .main {
		cursor: default;
	}
	input {
		flex: none;
		margin-top: 0.25rem;
		width: 1.05rem;
		height: 1.05rem;
		accent-color: var(--accent);
	}
	.body {
		min-width: 0;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: baseline;
	}
	.name {
		font-family: var(--mono);
		font-weight: 600;
	}
	.note {
		font-size: 0.78rem;
		color: var(--muted);
	}
	p {
		margin: 0.2rem 0 0;
		color: var(--muted);
		font-size: 0.9rem;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.3rem;
	}
	.chip {
		font-size: 0.75rem;
		line-height: 1.4;
		padding: 0.05rem 0.45rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--muted);
	}
	/* footer sits at the bottom when the grid stretches the card */
	.foot {
		margin-top: auto;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.3rem 1rem;
		font-size: 0.85rem;
	}
	summary {
		cursor: pointer;
		color: var(--muted);
	}
	summary:hover {
		color: var(--text);
	}
	ul {
		margin: 0.3rem 0 0;
		padding-left: 1.2rem;
	}
	li {
		font-family: var(--mono);
	}
	.homepage {
		margin-left: auto;
	}
</style>
