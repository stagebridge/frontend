export default function SearchInput() {
  return (
    <form role="search" onSubmit={(e) => e.preventDefault()}>
      <input placeholder="한국과 일본의 콘서트를 한눈에!" />
    </form>
  );
}
