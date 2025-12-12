export default function AutoRefundInfo() {
  return (
    <div className="rounded-lg border p-4 text-sm leading-6 dark:border-neutral-800">
      <p className="font-medium">자동 환불 안내</p>
      <ol className="mt-2 list-decimal pl-4">
        <li>콘서트 취소/연기는 티켓이 자동 환불됩니다.</li>
        <li>결제 카드사에 따라 환불 반영까지 시차가 있을 수 있습니다.</li>
        <li>환불 관련 문의는 고객센터로 접수해 주세요.</li>
      </ol>
      <p className="mt-2 text-neutral-500">
        ※ 이벤트 및 쿠폰 적용 결제의 경우 부분 환불이 적용될 수 있습니다.
      </p>
    </div>
  );
}
